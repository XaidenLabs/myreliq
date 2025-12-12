export const sendError = (message: string, status = 400) => {
  return Response.json({ error: message }, { status });
};

export const sendSuccess = <T>(data: T, status = 200) => {
  return Response.json({ data }, { status });
};
