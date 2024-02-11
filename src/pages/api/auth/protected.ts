import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
 

  

  async function loginUser() {
    
    const token = cookies.get('sb-access-token');

    try {
        const response = await fetch('https://interview-plus.onrender.com/api/protected', {
                        method: 'GET',
                        headers: {
                            'x-access-token': token?.value!,
                        },
                    });

      if (response.status === 200) {
        const result = await response.json();
        const token = result.message;
        console.log('messagereceived:', token);
        return token;
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

  // Use await here to ensure loginUser completes before moving forward
  const globalToken = await loginUser();

  if (globalToken) {
    // Assuming you have a cookies object, set the token as a cookie
    cookies.set('sb-access-message', globalToken, { sameSite: 'strict', path: '/', secure: false });
    
    // Redirect to the protected page
    return redirect("/protected");
  } else {
    return new Response("Login failed", { status: 401 });
  }
};



