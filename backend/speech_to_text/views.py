from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from pvleopard import create as create_leopard, LeopardActivationLimitError, LeopardError

from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt
def convert_prerecorded_audio_to_text(request):
    if request.method == 'POST' and request.FILES.get('audioFile'):
        try:
            # Zapisanie pliku na serwerze
            audio_file = request.FILES['audioFile']
            fs = FileSystemStorage()
            filename = fs.save(audio_file.name, audio_file)

            # Stworzenie instancji Leoparda oraz jej użycie
            leopard = create_leopard(access_key=settings.ACCESS_KEY)
            transcript, words = leopard.process_file(fs.path(filename))

            # Wyczyszczenie zasobów
            leopard.delete()
            fs.delete(filename)

            # Struktura odpowiedzi
            response_data = {
                'transcript': transcript,
                'words': [{'word': word.word, 'start_sec': word.start_sec, 'end_sec': word.end_sec, 'confidence': word.confidence} for word in words]
            }
            return JsonResponse(response_data)
        
        except LeopardActivationLimitError:
            return JsonResponse({'error': "AccessKey has reached its processing limit."}, status=500)
        
        except LeopardError:
            return JsonResponse({'error': "Unable to transcribe audio file."}, status=500)

    return JsonResponse({'error': "Method not allowed or no file provided."}, status=405)