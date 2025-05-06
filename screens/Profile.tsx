import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Footer from '../components/Footer';

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [fullName, setFullName] = useState("Ahmed Hassan");
  const [email, setEmail] = useState("ahmed.hassan@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("+966 50 123 4567");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Boost Arabia</Text>
          <TouchableOpacity>
            <MaterialIcons name="settings" size={24} color="#68d6ff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require("../assets/swordsman.png")}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraIcon}>
                <MaterialIcons name="camera-alt" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text
              style={styles.profileName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {fullName}
            </Text>
            <TouchableOpacity>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <DetailInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <DetailInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
            />
            <DetailInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <Footer activeTab="Profile" />
      </View>
    </SafeAreaView>
  );
};

interface DetailInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

const DetailInput: React.FC<DetailInputProps> = ({ label, value, onChangeText }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.detailInputContainer}>
      <TextInput
        style={styles.detailInput}
        value={value}
        onChangeText={onChangeText}
      />
      <MaterialIcons name="edit" size={20} color="#68d6ff" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101b23",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#101b23",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#68d6ff",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#68d6ff",
    borderRadius: 15,
    padding: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    maxWidth: "80%",
    textAlign: "center",
    marginTop: 10,
  },
  editProfileText: {
    color: "#68d6ff",
    fontSize: 14,
    marginTop: 5,
  },
  detailsSection: {
    paddingHorizontal: 15,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    color: "#cccccc",
    fontSize: 14,
    marginBottom: 5,
  },
  detailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  detailInput: {
    flex: 1,
    color: "#ffffff",
  },
  buttonContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
  },
  saveButton: {
    backgroundColor: "#68d6ff",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: "#f44336",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  signOutButtonText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
