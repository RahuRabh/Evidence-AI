import { User } from "../../models/user.js";

export async function updateProfileHandler(req, res) {
  try {
    const userId = req.user.userId;
    const { name } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.provider !== "local") {
      return res.status(403).json({
        error: "Google SSO account cannot update details",
      });
    }

    if (name) user.name = name;
    if (file) console.log("Recieved a image file", file.originalname);

    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: userId,
        name: user.name,
        image: user.image,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Error updating user details", err);
    return res.status(501).json({ error: "Internal server error" });
  }
}
