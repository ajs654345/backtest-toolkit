import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast({
      title: "Tema cambiado",
      description: `Se ha cambiado al tema ${newTheme === "dark" ? "oscuro" : "claro"}`,
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}