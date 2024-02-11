import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  
  

  async function loginUser() {
    const url = 'https://interview-plus.onrender.com/api/delete-user';
    const token = cookies.get('sb-access-token');


    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'x-access-token': token?.value!,
        },
        
      });

      if (response.status === 200) {
        const result = await response.text();
        // Assuming the token is in the response, you can use it as needed
        const message = result;
        console.log('Message received:', message);
        return message;
      } else {
        console.error('Error:', response.status);
        // Handle other error responses if needed
        return null;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Handle fetch errors if needed
      return null;
    }
  }

  const globalToken = await loginUser();

  if (globalToken) {
    cookies.set('sb-access-name', "", { sameSite: 'strict', path: '/', secure: false });

    return redirect("/register");
  } else {
    return new Response("Login failed", { status: 401 });
  }
};
