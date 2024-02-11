import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  async function loginUser(email, password) {
    const url = 'https://interview-plus.onrender.com/api/login';
    const data = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.status === 200) {
        const result = await response.json();
        // Assuming the token is in the response, you can use it as needed
        const token = result.token;
        console.log('Token received:', token);
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
  const globalToken = await loginUser(email, password);

  if (globalToken) {
    // Assuming you have a cookies object, set the token as a cookie
    cookies.set('sb-access-token', globalToken, { sameSite: 'strict', path: '/', secure: false });
    
    // Redirect to the protected page
    return redirect("/api/auth/protected");
  } else {
    return new Response("Login failed", { status: 401 });
  }
};
