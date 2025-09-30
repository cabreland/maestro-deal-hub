import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Deals = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Deals</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Deal Management</h2>
            <p className="text-muted-foreground">
              Paste your existing deal management components here.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Deals;
