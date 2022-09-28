import React from "react";
import * as RNP from "react-native-paper";
import * as RN from "react-native";
import { ListItem } from "./codecs";

export function TodoListContainer(
  props: React.PropsWithChildren<{ isLoading?: boolean }>
) {
  if (props.isLoading)
    return (
      <RN.View style={{ padding: 18 }}>
        <RN.ActivityIndicator size={32} />
      </RN.View>
    );
  return <React.Fragment>{props.children}</React.Fragment>;
}

export function TodoListEntry(props: ListItem) {
  return (
    <RNP.List.Item
      left={() => (
        <RNP.Checkbox.Android
          status={props.completed ? "checked" : "unchecked"}
        />
      )}
      title={props.title}
      description={props.username}
    />
  );
}
