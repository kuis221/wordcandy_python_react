from django.views.generic import TemplateView


class RobotsView(TemplateView):
    template_name = "0DFD5E3CED717C269E2CC5AE45CA6410.txt"


class IndexView(TemplateView):
    template_name = "index.html"


class ResetPasswordView(TemplateView):
    template_name = "reset_password.html"

    def get_context_data(self, **kwargs):
        context = super(ResetPasswordView, self).get_context_data(**kwargs)
        context['uidb64'] = kwargs['uidb64']
        context['token'] = kwargs['token']
        return context
