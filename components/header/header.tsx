import Link from "next/link";
import HeaderGithub from "./header-github";
import { HeaderThemeToggle } from "./header-theme-toggle";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-2 w-full border-b">
      <div className="flex gap-4">
        <Button variant="outline">
          <Link href="/forked">Forked example</Link>
        </Button>
        <Button variant="outline">
          <Link href="/me">My example</Link>
        </Button>
        <Button variant="outline">
          <Link href="/second">Second example</Link>
        </Button>
      </div>
    </div>
  );
}
