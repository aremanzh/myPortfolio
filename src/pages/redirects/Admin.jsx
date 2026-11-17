import { useEffect } from "react";

export default function Admin() {
  useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);
  return null;
}
