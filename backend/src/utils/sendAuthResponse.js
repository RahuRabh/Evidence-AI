import jwt from "jsonwebtoken";

export function sendAuthResponse(
  res,
  user,
  statusCode = 200,
  customMessage = null,
) {
  // 1. Generate access token (Short-lived)
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // 2. Generate refresh token (Long-lived) signed with a DISTINCT secret
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  // 3. Bake the refresh token directly into an HTTP-Only Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 4. Dispatch consistent response payload
  const responsePayload = {
    token: accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    },
  };

  if (customMessage) {
    responsePayload.message = customMessage;
  }

  return res.status(statusCode).json(responsePayload);
}
