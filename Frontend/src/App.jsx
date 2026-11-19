import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Citizens from "./pages/Citizens";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Audit from "./pages/Audit";
import { LanguageProvider } from "./context/LanguageContext";
function Guard({ children, roles }) {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading)
		return <div className="app-loading">Loading secure workspace…</div>;
	if (!user)
		return (
			<Navigate
				to="/login"
				state={{ from: location }}
				replace
			/>
		);
	if (roles && !roles.includes(user.role))
		return (
			<Navigate
				to="/"
				replace
			/>
		);
	return children;
}
function LoginRoute() {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading) return <div className="app-loading">Loading secure workspace…</div>;
	if (user) {
		const from = location.state?.from;
		const destination = from && from.pathname !== "/login"
			? `${from.pathname}${from.search || ""}${from.hash || ""}`
			: "/";
		return <Navigate to={destination} replace />;
	}
	return <Login />;
}
function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/login"
				element={<LoginRoute />}
			/>
			<Route
				element={
					<Guard>
						<Layout />
					</Guard>
				}
			>
				<Route
					index
					element={<Dashboard />}
				/>
				<Route
					path="citizens"
					element={<Citizens />}
				/>
				<Route
					path="register"
					element={<Register />}
				/>
				<Route
					path="verification"
					element={
						<Guard roles={["ADMIN"]}>
							<Verification />
						</Guard>
					}
				/>
				<Route
					path="audit"
					element={
						<Guard roles={["ADMIN"]}>
							<Audit />
						</Guard>
					}
				/>
			</Route>
			<Route
				path="*"
				element={
					<Navigate
						to="/"
						replace
					/>
				}
			/>
		</Routes>
	);
}
export default function App() {
	return (
		<AuthProvider>
			<LanguageProvider><AppRoutes /></LanguageProvider>
		</AuthProvider>
	);
}
