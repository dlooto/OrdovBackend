from django.shortcuts import render

# Create your views here.
def index(request):
    context = {}
    return render(request, 'recruit_company/index.html', context)
