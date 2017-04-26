from django.conf.urls import include, url

from .views import SynonymsView, AntonymsView, ExportTemplatesView, KeywordToolView, ShopList, SubscribeView, UserDetailsView, ExportKeywordsView

urlpatterns = [
    url(r'^synonyms/$', SynonymsView.as_view(), name='synonyms'),
    url(r'^antonyms/$', AntonymsView.as_view(), name='antonyms'),
    url(r'^keywordtool/$', KeywordToolView.as_view(), name='keywordtool'),
    url(r'^export/templates/$', ExportTemplatesView.as_view(), name='export_templates'),
    url(r'^export/keywords/$', ExportKeywordsView.as_view(), name='export_keywords'),
    url(r'^user/$', UserDetailsView.as_view(), name='user'),
    url(r'^templates/$', ShopList.as_view(), name='templates'),
    url(r'^subscribe/$', SubscribeView.as_view(), name='subscribe'),
]
