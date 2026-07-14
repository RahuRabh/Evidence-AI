import { useState } from "react";

import { getInitials } from "@/utils/genInitials";

import styles from "./Avatar.module.css";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (src && !imageFailed) {
    return (
      <img
        src={src}
        alt={`${name}'s profile`}
        className={`${styles.avatar} ${styles[size]}`}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className={`${styles.avatarFallback} ${styles[size]}`}>
      {getInitials(name)}
    </div>
  );
}