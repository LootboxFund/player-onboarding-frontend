import { ApolloProvider } from "@apollo/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import client from "./api/graphql/client";
import AuthProvider from "./hooks/useAuth/AuthProvider";
import routes from "./routes";
import { ConfigProvider, theme } from "antd";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <RouterProvider router={routes} />;
        </ConfigProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
