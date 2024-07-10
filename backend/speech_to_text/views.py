from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from pvleopard import create, LeopardActivationLimitError, LeopardError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt
def convert_audio_to_text(request):
    if request.method == 'POST' and request.FILES.get('audioFile'):
        try:
            # save file to server
            audio_file = request.FILES['audioFile']
            fs = FileSystemStorage()
            filename = fs.save(audio_file.name, audio_file)

            # transcribe with Leopard Speech-to-Text
            leopard = create(access_key=settings.ACCESS_KEY)
            transcript, words = leopard.process_file(fs.path(filename))

            # clean up
            leopard.delete()
            fs.delete(filename)

            # Prepare response
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
