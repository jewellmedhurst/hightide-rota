const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  let store;
  try {
    store = getStore("rota");
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Storage unavailable: " + e.message }),
    };
  }

  // GET — return current rota data
  if (event.httpMethod === "GET") {
    try {
      const raw = await store.get("main");
      const data = raw ? JSON.parse(raw) : {};
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (e) {
      return { statusCode: 200, headers, body: JSON.stringify({}) };
    }
  }

  // POST — save rota data
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);
      await store.set("main", JSON.stringify(body));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: e.message }),
      };
    }
  }

  return { statusCode: 405, headers, body: "Method not allowed" };
};
