from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from pvleopard import create as create_leopard, LeopardActivationLimitError, LeopardError
from pvcheetah import create as create_cheetah, CheetahActivationLimitError, CheetahError

import io
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt
def convert_prerecorded_audio_to_text(request):
    if request.method == 'POST' and request.FILES.get('audioFile'):
        try:
            # save file to server
            audio_file = request.FILES['audioFile']
            fs = FileSystemStorage()
            filename = fs.save(audio_file.name, audio_file)

            # transcribe with Leopard Speech-to-Text
            leopard = create_leopard(access_key=settings.ACCESS_KEY)
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


# @csrf_exempt
# def convert_audio_to_text(request):
#     if request.method == 'POST':
#         try:
#             audio_data = request.body

#             if not audio_data:
#                 return JsonResponse({'error': "No audio data provided."}, status=400)

#             # transcribe with Cheetah Speech-to-Text
#             cheetah = create_cheetah(access_key=settings.ACCESS_KEY)
            
#             partial_transcript, is_endpoint = cheetah.process(audio_data)
#             final_transcript = ""
#             if is_endpoint:
#                 final_transcript = cheetah.flush()

#             cheetah.delete()

#             # Prepare response
#             response_data = {
#                 'partial_transcript': partial_transcript.transcript,
#                 'final_transcript': final_transcript.translate if final_transcript else "",
#             }
#             return JsonResponse(response_data)
        
#         except CheetahActivationLimitError as e:
#             return JsonResponse({'error': f"AccessKey has reached its processing limit. {str(e)}"}, status=500)
        
#         except CheetahError as e:
#             return JsonResponse({'error': f"Unable to transcribe audio file. {str(e)}"}, status=500)
        
#         except Exception as e:
#             return JsonResponse({'error': f"An unexpected error occurred. {str(e)}"}, status=500)

#     return JsonResponse({'error': "Method not allowed or no file provided."}, status=405)

# @csrf_exempt
# def convert_audio_to_text(request):
#     if request.method == 'POST':
#         try:
#             audio_data = request.body

#             if not audio_data:
#                 return JsonResponse({'error': "No audio data provided."}, status=400)

#             # Create Cheetah instance
#             cheetah = create_cheetah(access_key=settings.ACCESS_KEY)

#             # Initialize variables for streaming
#             final_transcript = ""
#             is_endpoint = False

#             # Process audio data chunk by chunk
#             stream = io.BytesIO(audio_data)
#             chunk_size = 1024  # adjust chunk size as needed
#             while not is_endpoint:
#                 chunk = stream.read(chunk_size)
#                 if not chunk:
#                     break
#                 partial_transcript, is_endpoint = cheetah.process(chunk)
#                 final_transcript += partial_transcript.transcript

#             # Clean up
#             cheetah.delete()

#             # Prepare response
#             response_data = {
#                 'transcript': final_transcript,
#                 'is_endpoint': is_endpoint
#             }
#             return JsonResponse(response_data)

#         except CheetahActivationLimitError:
#             return JsonResponse({'error': "AccessKey has reached its processing limit."}, status=500)

#         except CheetahError:
#             return JsonResponse({'error': "Unable to transcribe audio file."}, status=500)

#         except Exception as e:
#             return JsonResponse({'error': f"An unexpected error occurred. {str(e)}"}, status=500)

#     return JsonResponse({'error': "Method not allowed or no audio data provided."}, status=405)


# ZAKOMENTOWANE 19.10


# from rest_framework import status

# @api_view(['POST'])
# def convert_audio_to_text(request):
#     audio_data = request.data.get('audioData')

#     if not audio_data:
#         return Response({'error': 'Missing audio data'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         # cheetah_instance = cheetah_sdk.Cheetah(access_key, model_path)
#         cheetah_instance = create_cheetah(access_key=settings.ACCESS_KEY)
#         transcript = cheetah_instance.process(audio_data)
#         cheetah_instance.release()
#         return Response({'transcript': transcript}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

cheetah = create_cheetah(access_key=settings.ACCESS_KEY)

@csrf_exempt
def convert_audio_to_text(request):
    if request.method == 'POST':
        try:
            audio_data = request.FILES['audio'].read()  # Oczekiwanie na plik audio w formacie .wav lub podobnym
            audio_stream = io.BytesIO(audio_data)

            # Procesowanie audio za pomocą Cheetah
            partial_transcript, is_endpoint = cheetah.process(audio_stream)

            if is_endpoint:
                final_transcript = cheetah.flush()
                return JsonResponse({'transcript': final_transcript})

            return JsonResponse({'partial_transcript': partial_transcript})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'message': 'Send a POST request with an audio file.'}, status=400)