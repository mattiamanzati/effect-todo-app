import * as RN from "react-native";
import * as RNP from "react-native-paper";
import TodoList from "./TodoList";
import * as React from "react";

export default function App() {
  const [inList, setInList] = React.useState(false)
  const onBack = React.useCallback(() => setInList(false), [setInList])
  const onEnter = React.useCallback(() => setInList(true), [setInList])

  return (
    <RN.View style={RN.StyleSheet.absoluteFill}>
      <RNP.Provider theme={RNP.MD2LightTheme}>
        {inList ? <TodoListScreen onBack={onBack} /> : <MainScreen onEnter={onEnter} />}
      </RNP.Provider>
    </RN.View>
  );
}

function MainScreen(props: { onEnter: () => void}){
  return (
    <React.Fragment>
      <RNP.Appbar elevated={true}>
        <RNP.Appbar.Content title="Awesome TODOs!" />
      </RNP.Appbar>
      <RNP.List.Item title="TODOs" description="Manage your list of things to do" onPress={props.onEnter} />
    </React.Fragment>
  );        
}

function TodoListScreen(props: { onBack: () => void}){
  return (
    <React.Fragment>
      <RNP.Appbar elevated={true}>
        <RNP.Appbar.BackAction onPress={props.onBack} />
        <RNP.Appbar.Content title="TODO List" />
      </RNP.Appbar>
      <RN.ScrollView style={{ flex: 1 }}>
        <TodoList />
      </RN.ScrollView>
    </React.Fragment>
  );        
}