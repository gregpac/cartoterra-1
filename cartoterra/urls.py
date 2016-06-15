from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from geodata.views import BigMapView
from haystack.forms import ModelSearchForm
from haystack.views import SearchView, search_view_factory
from cartoterra.views import HomeView, DonateView, SignupView

admin.autodiscover()

urlpatterns = [
    url(r'^$', HomeView.as_view(), name="home"),
    url(r'^map/$', BigMapView.as_view(), name="map"),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    # url(r'^my_admin/jsi18n',
    #     include('django.views.i18n.null_javascript_catalog')),
    url(r"^geodata/", include("geodata.urls")),
    url(r'^donate/$', DonateView.as_view(), name="donate"),
    url(r"^admin/", include(admin.site.urls)),
    url(r"^account/signup/$", SignupView.as_view(),
        name="account_signup"),
    url(r"^account/", include("account.urls")),
    url(r'^knowledge/', include('knowledge.urls')),
    url(r"^faq/", include("faq.urls")),
    url(r'^search/', include('haystack.urls')),
    url(r'^searchbis/',
        search_view_factory(view_class=SearchView, form_class=ModelSearchForm),
        name="searchbis"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if 'rosetta' in settings.INSTALLED_APPS:
        urlpatterns += [url(r'^rosetta/', include('rosetta.urls'))]
