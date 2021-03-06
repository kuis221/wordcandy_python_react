from django.conf.urls import include, url

from .views import *

urlpatterns = [
    url(r'^synonyms/$', SynonymsView.as_view(), name='synonyms'),
    url(r'^antonyms/$', AntonymsView.as_view(), name='antonyms'),
    url(r'^keywordtool/$', KeywordToolView.as_view(), name='keywordtool'),
    url(r'^export/templates/$', ExportTemplatesView.as_view(), name='export_templates'),
    url(r'^export/keywords/$', ExportKeywordsView.as_view(), name='export_keywords'),
    url(r'^user/$', UserDetailsView.as_view(), name='user'),
    url(r'^templates/$', ShopList.as_view(), name='templates'),
    url(r'^trademarks/$', TrademarksView.as_view(), name='trademarks'),
    url(r'^subscribe/$', SubscribeView.as_view(), name='subscribe'),
    url(r'^amazon/$', AmazonProductsView.as_view(), name='amazon'),
    url(r'^google_auth/$', OAuthView.as_view(), name='oauth2google'),
]
