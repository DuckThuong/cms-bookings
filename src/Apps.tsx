import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import RouterWeb from "./routers/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";
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
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#f97316",
            colorBgBase: "#0b1426",
            colorBgContainer: "#152045",
            colorBgElevated: "#152045",
            borderRadius: 8,
            fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif",
          },
          components: {
            Dropdown: {
              colorBgElevated: "#152045",
            },
            Tooltip: {
              colorBgSpotlight: "#1e3460",
            },
          },
        }}
      >
        <UserProvider initialUser={initialUser}>
          <LoadingProvider>
            <NotificationProvider>
              <AntdApp>
                <RouterWeb />
              </AntdApp>
            </NotificationProvider>
          </LoadingProvider>
        </UserProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
