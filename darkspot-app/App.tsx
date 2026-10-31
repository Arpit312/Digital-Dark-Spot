import React from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/auth";
import { c } from "./src/theme";
import Onboarding from "./src/screens/Onboarding";
import { Login, Signup } from "./src/screens/Auth";
import Analyze from "./src/screens/Analyze";
import Progress from "./src/screens/Progress";
import Report from "./src/screens/Report";
import Reports from "./src/screens/Reports";
import Watchtower from "./src/screens/Watchtower";
import Profile from "./src/screens/Profile";
import Accuracy from "./src/screens/Accuracy";
import HowItWorks from "./src/screens/HowItWorks";
import Campus from "./src/screens/Campus";
import Settings from "./src/screens/Settings";
import Officer from "./src/screens/Officer";
import Admin from "./src/screens/Admin";
const Stack = createNativeStackNavigator(), Tab = createBottomTabNavigator();
const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: c.bg, card: c.bg, border: c.line, primary: c.fg, text: c.fg } };
const icons: any = { Analyze: "search", Reports: "file-text", Watchtower: "bell", Profile: "user" };
function Tabs() {
  return <Tab.Navigator screenOptions={({ route }: any) => ({ headerShown: false, tabBarActiveTintColor: c.fg, tabBarInactiveTintColor: c.subtle, tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.line, height: 62, paddingBottom: 8, paddingTop: 6 }, tabBarLabelStyle: { fontSize: 10, fontWeight: "500" }, tabBarIcon: ({ color }: any) => <Feather name={icons[route.name]} size={21} color={color} /> })}>
    <Tab.Screen name="Analyze" component={Analyze} /><Tab.Screen name="Reports" component={Reports} /><Tab.Screen name="Watchtower" component={Watchtower} /><Tab.Screen name="Profile" component={Profile} /></Tab.Navigator>;
}
function Root() {
  const { user, ready, seen } = useAuth();
  if (!ready) return <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: "center" }}><ActivityIndicator color={c.fg} /></View>;
  return <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle: { backgroundColor: c.bg } }}>
    {user ? <>
      <Stack.Screen name="Tabs" component={Tabs} /><Stack.Screen name="Progress" component={Progress} /><Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Accuracy" component={Accuracy} /><Stack.Screen name="HowItWorks" component={HowItWorks} /><Stack.Screen name="Campus" component={Campus} />
      <Stack.Screen name="Settings" component={Settings} /><Stack.Screen name="Officer" component={Officer} /><Stack.Screen name="Admin" component={Admin} /></> :
      <>{!seen && <Stack.Screen name="Onboarding" component={Onboarding} />}<Stack.Screen name="Login" component={Login} /><Stack.Screen name="Signup" component={Signup} /></>}
  </Stack.Navigator>;
}
export default function App() {
  return <SafeAreaProvider><AuthProvider><NavigationContainer theme={theme}><StatusBar style="light" /><Root /></NavigationContainer></AuthProvider></SafeAreaProvider>;
}
