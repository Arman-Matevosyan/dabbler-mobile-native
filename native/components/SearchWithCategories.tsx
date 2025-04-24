import {useTheme} from '@/design-system';
import {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CategoryList} from './CategoryList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SearchWithCategoriesProps {
  searchValue?: string;
  selectedCategories?: string[];
  onCategoryToggle: (category: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  debounceDelay?: number;
  onSearchChange: (query: string) => void;
}

export const SearchWithCategories = ({
  searchValue = '',
  selectedCategories = [],
  onCategoryToggle,
  placeholder = 'Search...',
  onSearchChange,
  isLoading = false,
}: SearchWithCategoriesProps) => {
  const {colors, mode} = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isSearching = useRef(false);

  const handleSearchChange = (text: string) => {
    isSearching.current = true;
    onSearchChange(text);
  };

  const handleConfirmCategories = (confirmedCategories: string[]) => {
    onCategoryToggle(confirmedCategories);
  };

  const handleDismiss = () => {
    if (!isSearching.current) {
      setIsModalVisible(false);
    }
  };
  const insets = useSafeAreaInsets();
  const backgroundStyle = {
    backgroundColor: colors.background,
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.innerContainer, backgroundStyle]}>
        <Animated.View
          style={[
            styles.searchContainer,
            getContainerStyles(colors, isFocused),
          ]}>
          <Icon
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {color: mode === 'dark' ? '#fff' : colors.textPrimary},
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={searchValue}
            onChangeText={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => {
                isSearching.current = false;
              }, 300);
            }}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <View style={styles.searchActions}></View>
        </Animated.View>

        <View style={styles.categoriesWrapper}>
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.categoriesButton,
                {backgroundColor: colors.accent},
              ]}
              onPress={() => setIsModalVisible(true)}>
              <Text style={[styles.categoriesButtonText, {color: '#fff'}]}>
                {'venues.categories'}
              </Text>
              <Icon name="arrow-drop-up" size={20} color="#fff" />
            </TouchableOpacity>
            {selectedCategories.length > 0 && (
              <Text
                style={[styles.selectedCount, {color: colors.textSecondary}]}>
                {selectedCategories.length} {'venues.selected'}
              </Text>
            )}
          </View>
        </View>
      </View>

      <CategoryList
        isVisible={isModalVisible}
        onDismiss={handleDismiss}
        selectedCategories={selectedCategories}
        onConfirm={handleConfirmCategories}
      />
    </View>
  );
};

const getContainerStyles = (colors: any, isFocused: boolean) => ({
  backgroundColor: colors.background,
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10000,
  },
  innerContainer: {
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 12,
    opacity: 0.9,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    fontWeight: '400',
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoriesWrapper: {
    height: 44,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  categoriesButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  selectedCount: {
    fontSize: 14,
  },
});
