import UploadForm from "../../components/UploadForm";
import ContentTypes from "../../components/ContentTypes";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Upload() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl text-center text-background font-bold  mb-2">
              Upload Your Content
            </h1>
            <p className="text-lg text-background text-center">
              Upload video, audio, or documents to transform into your content
              empire
            </p>
          </div>

          <div className=" gap-8">
            <div className="border border-2 border-gray-200 p-4 rounded-md  ">
              <UploadForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
