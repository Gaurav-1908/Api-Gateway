import { promises as fs } from "fs";

export async function GET() {
  try {
    // 👇 Replace this with the full absolute path to your JSON file
    const filePath = "D:/API-Gateay1/Api-Gateway/conf.json";

    const fileContents = await fs.readFile(filePath, "utf-8");
    const logs = JSON.parse(fileContents);

    return new Response(JSON.stringify(logs), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch logs" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json(); // 👈 data sent from frontend

    // Path to your config file
    const filePath = "D:/API-Gateay1/Api-Gateway/conf.json";

    // Write new JSON to file
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");

    // systemctl restart pm2 

    return new Response(
      JSON.stringify({ message: "Config saved successfully ✅" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("❌ Error saving config:", err);
    return new Response(
      JSON.stringify({ error: "Failed to save config" }),
      { status: 500 }
    );
  }
}