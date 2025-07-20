import { Link } from "react-router-dom";
import AdminImage from "../assets/admin_image.jpg"
import OverviewImage from "../assets/overview_image.jpg"

export default function HomePage() {
  return (
    <>
      <div className="w-full flex max-h-full">
        <div className="flex items-center w-full flex-col text-[var(--Accent)] bg-blue-400 p-12">
          <h1 className="text-6xl my-12 font-semibold">
            Welcome, please select a view
          </h1>
          <div className="grid grid-cols-2 gap-6 items-center w-full h-full">
            <Link
              to="/overview"
              className=" h-full pt-4 flex-col-reverse flex justify-center bg-gray-100 text-[var(--Accent)] delay-200 transition-all items-center rounded-tr-2xl shadow-xl hover:scale-[101%] cursor-pointer"
            >
              <img src={OverviewImage} className="w-full h-full rounded-tr-3xl object-cover" />
              <p className="text-4xl font-bold p-4">Overview Mode</p>
            </Link>
            <Link
              to="/login"
              className="h-full pt-4 flex-col-reverse bg-gray-100 text-[var(--Accent)] rounded-tl-2xl shadow-xl justify-center delay-200 transition-all items-center flex hover:scale-[101%] cursor-pointer"
            >
              <img src={AdminImage} className="w-full  h-full rounded-tl-3xl object-cover" />
              <p className="text-4xl font-bold p-4">Admin Mode</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
