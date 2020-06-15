import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    backgroundColor: colors.white,
    height: 52,
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: "center",
    color: colors.blue,
  },
});

export default styles;
