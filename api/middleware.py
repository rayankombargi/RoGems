from .models import Admin

class AdminSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        admin_id = request.session.get('admin_id')
        if admin_id:
            try:
                request.admin = Admin.objects.get(id=admin_id)
            except Admin.DoesNotExist:
                request.admin = None 
        else:
            request.admin = None
        
        return self.get_response(request)