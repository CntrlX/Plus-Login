import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return new Response("Name and password are required", { status: 400 });
  }

  async function updateUser(name, password) {
    const url = 'https://interview-plus.onrender.com/api/update-user';
    const data = {
      name: name,
      password: password
    };
    const token = cookies.get('sb-access-token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'x-access-token': token?.value!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.status === 200) {
        const result = await response.text();
        // Assuming the token is in the response, you can use it as needed
        const message = result;
        console.log('Message:', message);
        return message;
      } else {
        console.error('Error:', response.status);
        console.log(await response.text().then(function(data) {
            console.log(data); 
          }));
        // Handle other error responses if needed
        return null;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Handle fetch errors if needed
      return null;
    }
  }

  // Use await here to ensure updateUser completes before moving forward
  const globalToken = await updateUser(name, password);

  if (globalToken) {
    // Assuming you have a cookies object, set the token as a cookie
    cookies.set("sb-access-name", name, {
        sameSite: "strict",
        path: "/",
        secure: false,
      });
    
    // Redirect to the protected page
    return redirect("/protected");
  } else {
    return new Response("Update failed", { status: 401 });
  }
};
