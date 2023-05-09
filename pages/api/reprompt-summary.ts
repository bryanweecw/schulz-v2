import type { NextApiRequest } from 'next'

export const runtime="edge";

export default async function handler(
    req: Request,
  ) {
    const baseUrl = process.env.BACKEND_SERVICE;
    const jwtToken = process.env.SECRET_JWT_KEY;
    if (!baseUrl || !jwtToken) {
        return new Response(
            JSON.stringify({
                message: "BACKEND URL not configured correctly",
            }),
            { status: 400 }
        );
    }

    try {
        const url = `${baseUrl}/reprompt-summary`;
        console.log(`Making a call now to ${url} with JWT bearer ${jwtToken}`);

        const body = await req.json()

        const res = await fetch(`${baseUrl}/reprompt-summary`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(body),
        });

        console.log(`Response from backend: ${res.status} ${res.statusText}`);
        const data = await res.json()
        console.log(data)

        return new Response(
            JSON.stringify({
                data,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return new Response(
            JSON.stringify({
                message: "Unable to generate summary",
            }),
            { status: 400 }
        );
    }
  }