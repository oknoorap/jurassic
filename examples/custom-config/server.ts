// Custom port
// You also can read environment port from Deno.env.get("PORT")
export const port = 8080;

// Custom environment
export const env = {
  CUSTOM_VAR_ENV: "My Environment Variable",
  UNIVERSE: "Simulation Reality",
};

// Hooks: Before server start
export const onBeforeStart = () => {
  console.log("preparing...");
};

// Hooks: Server start
export const onStart = () => {
  console.log("server already started...");
};
