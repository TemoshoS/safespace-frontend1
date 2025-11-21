import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');

type ToggleMenuProps = {
  onNavigate?: (section: string) => void;
};

export default function ToggleMenu({ onNavigate }: ToggleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const router = useRouter();

  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({
    home: new Animated.Value(1),
    back: new Animated.Value(1),
    contact: new Animated.Value(1),
    about: new Animated.Value(1),
  }).current;

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateTo = (section: string) => {
    toggleMenu();
    setTimeout(() => {
      switch (section) {
        case 'home':
          router.push('/');
          break;
        case 'back':
          router.back();
          break;
        case 'contact':
          router.push('/contact-us');
          break;
        case 'about':
          router.push('/about-us');
          break;
      }
      onNavigate?.(section);
    }, 250);
  };

  const onPressIn = (section: string) => {
    Animated.spring(scaleAnims[section], { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = (section: string) => {
    Animated.spring(scaleAnims[section], { toValue: 1, useNativeDriver: true }).start();
    setActiveItem(null);
  };

  const menuItems = [
    { name: 'Home', section: 'home', icon: 'home' },
    { name: 'Back', section: 'back', icon: 'arrow-undo' },
    { name: 'Contact Us', section: 'contact', icon: 'call' },
    { name: 'About Us', section: 'about', icon: 'information-circle' },
  ];

  return (
    <>
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <Animated.View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity style={styles.backButton} onPress={toggleMenu}>
          <Ionicons name="arrow-back" size={30} color="#c7da30" />
        </TouchableOpacity>

        <Text style={styles.menuTitle}>Menu</Text>

        {menuItems.map((item) => (
          <Animated.View key={item.section} style={{ transform: [{ scale: scaleAnims[item.section] }] }}>
            <TouchableOpacity
              style={[styles.menuItem, activeItem === item.section && styles.menuItemActive]}
              onPress={() => navigateTo(item.section)}
              onPressIn={() => { setActiveItem(item.section); onPressIn(item.section); }}
              onPressOut={() => onPressOut(item.section)}
            >
              <LinearGradient
                colors={activeItem === item.section ? ['#c7da30', '#d7e47a'] : ['#f7f9e9', '#eaf0b5']}
                style={styles.menuItemGradient}
              >
                <Ionicons name={item.icon as any} size={22} color="#333" style={{ marginRight: 10 }} />
                <Text style={styles.menuText}>{item.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      {!isOpen && (
        <TouchableOpacity style={styles.hamburger} onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#c7da30" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    position: 'absolute',
    top: 50,
    left: 25,
    zIndex: 20,
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  menuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    width: '85%',
  },
  menuItemActive: {
    borderWidth: 1,
    borderColor: '#c7da30',
  },
  menuText: {
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
});
