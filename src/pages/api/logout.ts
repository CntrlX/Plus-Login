import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  
    cookies.set('sb-access-token', "", { sameSite: 'strict', path: '/', secure: false });
    cookies.set('sb-access-name', "", { sameSite: 'strict', path: '/', secure: false });

 
    return redirect("/signin");
  
};
