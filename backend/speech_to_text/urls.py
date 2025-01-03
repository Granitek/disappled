from django.urls import path
from . import views


urlpatterns = [
    path('Leopard/', views.convert_prerecorded_audio_to_text, name='convert_prerecorded_audio_to_text'),
    # path('Cheetah/', views.convert_audio_to_text , name='convert_audio_to_text')
]
