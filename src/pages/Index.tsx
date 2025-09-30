import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">M&A Deal Management Platform</h1>
        <p className="text-xl text-muted-foreground">Secure, efficient deal tracking and collaboration</p>
        <Button onClick={() => navigate("/auth")} size="lg">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
