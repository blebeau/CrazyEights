import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from "./app/screens/Login"
import Game from "./app/screens/Game"


const Stack = createStackNavigator();

function Root() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Login Screen" component={LoginScreen} />
				<Stack.Screen name="Game" component={Game} />
			</Stack.Navigator>
		</NavigationContainer>

	);
}

export default Root;