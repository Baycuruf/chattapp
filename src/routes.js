import Register from "./pages/authorization/Register";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./pages/profile/Layout";
import Home from "./pages/home/Home";
import ProfileLayout from "./pages/profile";
import ProfilePosts from "./pages/profile/Posts";
import AuthLayout from "./auth";
import Login from "./pages/authorization/Login";
import ChatApp from "./dmessage/Chat";
import UpdateProfile from "./pages/profile/update/UpdateProfile";
import UpdatePassword from "./pages/profile/update/UpdatePassword";
import Likes from "./pages/likes/Likes";
import CreatePost from "./pages/posts/CreatePost";
import Discover from "./pages/discover/Discover";
import Search from "./pages/search/Search";
import Layout from "./pages/profile/otherprofile/Layout";
import Profile from "./pages/profile/otherprofile/Profile";
import NotFound from "./pages/profile/NotFound";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    auth: true,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ":username",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <ProfilePosts />,
          },
          {
            path: "update",
            element: <UpdateProfile />,
          },
          
          {
            path: "tagged",
            element: <UpdateProfile />,
          },
          {
            path: "resetpassword",
            element: <UpdatePassword />,
          },
        ],
      },
      {
        path: "inbox",
        element: <ChatApp />,
      },
      {
          path: "profile",
          element: <Layout/>,
          children:[
              
              {
                  path:":username",
                  element: <Profile/>,
                  children: [
                    {
                      index: true,
                      element: <ProfilePosts />,
                    },
                    {
                      path: "reels",
                      element: <ProfilePosts />,
                    },
                    {
                      path: "update",
                      element: <UpdateProfile />,
                    },
                    
                    {
                      path: "tagged",
                      element: <UpdateProfile />,
                    },
                  ]
              },
              
          ]
      },
      {
        path: "posts",
        element: <CreatePost />,
      },
      {
          path:"explore",
          element: <Discover/>

      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      // {
      //     path:"addphoto",
      //     element: <AddPhoto/>

      // },
      {
        path: "likes",
        element: <Likes />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];

const authCheck = (routes) =>
  routes.map((route) => {
    if (route?.auth) {
      route.element = <PrivateRoute>{route.element}</PrivateRoute>;
    }
    if (route?.children) {
      route.children = authCheck(route.children);
    }
    return route;
  });

export default authCheck(routes);
