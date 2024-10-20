import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import teamImage from "@/assets/team.jpg"; // Add your team image
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-[1300px]">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We are committed to delivering the best real estate solutions.
        </p>
        {/* <img
          src={teamImage}
          alt="Our Team"
          className="mx-auto w-full max-w-[800px] rounded-lg shadow-lg"
        /> */}
      </section>

      <Separator className="my-12" />

      {/* Team Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <Card className="shadow-md">
            <CardHeader>
              <img
                src="https://ui.shadcn.com/avatars/02.png"
                alt="Jane Smith"
                className="w-24 h-24 mx-auto rounded-full"
              />
              <CardTitle className="mt-4">Khurshid Shaikh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Roll no. 44</p>
            </CardContent>
          </Card>

          {/* Team Member 2 */}
          <Card className="shadow-md">
            <CardHeader>
              <img
                src="https://ui.shadcn.com/avatars/02.png"
                alt="Jane Smith"
                className="w-24 h-24 mx-auto rounded-full"
              />
              <CardTitle className="mt-4">Omkar Pardeshi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Roll no. 20</p>
            </CardContent>
          </Card>

          {/* Team Member 3 */}
          <Card className="shadow-md">
            <CardHeader>
              <img
                src="https://ui.shadcn.com/avatars/02.png"
                alt="Jane Smith"
                className="w-24 h-24 mx-auto rounded-full"
              />
              <CardTitle className="mt-4">Krish Patil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Roll no. 26</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <img
                src="https://ui.shadcn.com/avatars/02.png"
                alt="Jane Smith"
                className="w-24 h-24 mx-auto rounded-full"
              />
              <CardTitle className="mt-4">Divyansh Mishra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Roll no. 09</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Call to Action */}
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-muted-foreground mb-8">
          Interested in joining our team or learning more about us? Contact us
          today.
        </p>
        <Link to="/contact">
          <Button>Contact Us</Button>
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
