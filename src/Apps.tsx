import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import RouterWeb from "./routers/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";
import { AuthProvider } from "./common/contexts/authContext";
import { UserProvider } from "./common/contexts/UserContext";
import viVN from "antd/locale/vi_VN";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const initialUser = {
    userName: "Nguyễn An",
    notifCount: 3,
    phone: "098 765 4321",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif",
          },
        }}
      >
        <AuthProvider>
          <UserProvider initialUser={initialUser}>
            <LoadingProvider>
              <NotificationProvider>
                <AntdApp>
                  <RouterWeb />
                </AntdApp>
              </NotificationProvider>
            </LoadingProvider>
          </UserProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
