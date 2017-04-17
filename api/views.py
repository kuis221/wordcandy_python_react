from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework import status

from django.http import HttpResponse
from django.conf import settings
from django.core.cache import cache

import requests
from datetime import datetime

from .serializers import SynonymsSerializer, AntonymsSerializer, ShopSerializer, TemplateSerializer, SubscribeSerializer
from .models import Shop, Subscribe

from openpyxl.writer.excel import save_virtual_workbook
from openpyxl import Workbook


class SynonymsView(APIView):

    def get(self, request, format=None):
        """
        Return words with synonyms
        """
        data = {}
        data['synonyms'] = []
        tags = request.GET.get('tags', '')
        for tag in tags.split(','):
            result = requests.get('https://wordsapiv1.p.mashape.com/words/{0}/synonyms'.format(tag),
                                  headers={
                "X-Mashape-Key": settings.MASHAPE,
                "Accept": "application/json",
            })
            if 'synonyms' in result.json():
                data['synonyms'] += result.json()['synonyms']
        return Response(data)


class AntonymsView(APIView):

    def get(self, request, format=None):
        """
        Return words with antonyms
        """
        data = {}
        data['antonyms'] = []
        tags = request.GET.get('tags', '')
        for tag in tags.split(','):
            result = requests.get('https://wordsapiv1.p.mashape.com/words/{0}/antonyms'.format(tag),
                                  headers={
                "X-Mashape-Key": settings.MASHAPE,
                "Accept": "application/json",
            })
            if 'antonyms' in result.json():
                data['antonyms'] += result.json()['antonyms']
        return Response(data)


class KeywordToolView(APIView):

    def get(self, request, format=None):
        """
        Return result from keywordtool
        """
        keywords = request.GET.get('tags', '')
        result = {
            'keywords': []
        }

        for word in keywords.split(','):
            payload = {
                'apikey': settings.KEYWORDTOOL,
                'keyword': '[{0}]'.format(word),
                'output': 'json',
                'country': 'us',
                'language': 'en',
                'metrics': 'true',
                'metrics_location': '2840',
                'metrics_language': 'en'
            }

            if cache.get(word, None):
                results = cache.get(word)
            else:
                data = requests.get('http://api.keywordtool.io/v2/search/suggestions/amazon', params=payload)
                try:
                    results = data.json()['results']
                    cache.set(str(word), results)
                except Exception as e:
                    results = []

            for item in results:
                for sub_item in results[item]:
                    if volume in sub_item:
                        result['keywords'].append({
                            'name': sub_item['string'],
                            'volume': sub_item['volume']})

        return Response(result)


class ExcelView(APIView):

    def get(self, request, format=None):
        """
        Return excel file
        """
        filename = "wordcandy.xlsx"
        wb = Workbook()
        response = HttpResponse(save_virtual_workbook(
            wb), content_type='application/vnd.ms-excel')
        response["Content-Disposition"] = 'attachment; filename="' + \
            filename + '"'
        response.write(save_virtual_workbook(wb))
        return response


class ShopList(GenericAPIView):
    serializer_class = ShopSerializer

    def get(self, request, format=None):
        """
        Return list of shops
        """
        shops = Shop.objects.all()
        serializer = self.serializer_class(shops, many=True)
        return Response(serializer.data)


class SubscribeView(GenericAPIView):
    serializer_class = SubscribeSerializer

    def post(self, request, format=None):
        """
        Return add email to subscribe
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
