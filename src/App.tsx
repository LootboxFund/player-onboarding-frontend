import { ApolloProvider } from "@apollo/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import client from "./api/graphql/client";
import AuthProvider from "./hooks/useAuth/AuthProvider";
import routes from "./routes";
import { ConfigProvider, theme } from "antd";
import EventProvider from "./hooks/useEvent/EventProvider";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <EventProvider>
            <RouterProvider router={routes} />;
          </EventProvider>
        </ConfigProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
