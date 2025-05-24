import { useTheme } from '@/design-system';
import { useCategories } from '@/hooks/useCategories';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryListProps {
  isVisible: boolean;
  onDismiss: () => void;
  selectedCategories: string[];
  onConfirm?: (categories: string[]) => void;
}

export const CategoryList = ({
  isVisible,
  onDismiss,
  selectedCategories: initialSelectedCategories,
  onConfirm,
}: CategoryListProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const searchInputRef = useRef<TextInput>(null);
  const isManualDismiss = useRef<boolean>(false);
  const hasBeenVisible = useRef<boolean>(false);
  const isSearching = useRef<boolean>(false);
  const insect = useSafeAreaInsets();

  const [categorySearchValue, setCategorySearchValue] = useState('');
  const [localSelectedCategories, setLocalSelectedCategories] =
    useState<string[]>(initialSelectedCategories);
  const [isSheetReady, setIsSheetReady] = useState(false);
  const [localIsVisible, setLocalIsVisible] = useState(isVisible);

  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    if (isVisible && !localIsVisible) {
      setLocalIsVisible(true);
    } else if (!isVisible && localIsVisible && isManualDismiss.current) {
      setLocalIsVisible(false);
    }
  }, [isVisible, localIsVisible]);

  useEffect(() => {
    if (localIsVisible) {
      if (!isSheetReady) {
        setTimeout(() => {
          bottomSheetRef.current?.present();
          setIsSheetReady(true);
          hasBeenVisible.current = true;
        }, 100);
      } else {
        bottomSheetRef.current?.present();
        hasBeenVisible.current = true;
      }

      setLocalSelectedCategories(initialSelectedCategories);
      setCategorySearchValue('');

      if (hasBeenVisible.current) {
        setTimeout(() => searchInputRef.current?.focus(), 200);
      }

      isManualDismiss.current = false;
    } else if (isSheetReady && hasBeenVisible.current && isManualDismiss.current) {
      bottomSheetRef.current?.dismiss();
    }
  }, [localIsVisible, initialSelectedCategories, isSheetReady]);

  useEffect(() => {
    return () => {
      setIsSheetReady(false);
      bottomSheetRef.current?.dismiss();
    };
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.filter((category: Category) =>
      category.name.toLowerCase().includes(categorySearchValue.toLowerCase()),
    );
  }, [categories, categorySearchValue]);

  const handleDismissModal = useCallback(() => {
    isManualDismiss.current = true;
    setLocalIsVisible(false);
    bottomSheetRef.current?.dismiss();
    onDismiss();
  }, [onDismiss]);

  const handleSheetDismiss = useCallback(() => {
    if (isManualDismiss.current) {
      onDismiss();
    }
  }, [onDismiss]);

  const handleToggleCategory = (categoryName: string) => {
    setLocalSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName],
    );
  };

  const handleSelectAll = () => {
    if (!categories || !Array.isArray(categories)) return;
    setLocalSelectedCategories(prev =>
      prev.length === categories.length ? [] : categories.map((cat: Category) => cat.name),
    );
  };

  const handleConfirm = () => {
    onConfirm?.(localSelectedCategories);
    isManualDismiss.current = true;
    setLocalIsVisible(false);
    handleDismissModal();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        onPress={() => {
          if (!isSearching.current) {
            isManualDismiss.current = true;
            props.onPress?.();
          }
          isSearching.current = false;
        }}
      />
    ),
    [],
  );

  const categoriesLength = Array.isArray(categories) ? categories.length : 0;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={[styles.bottomSheet, { backgroundColor: colors.background }]}
      style={{ paddingTop: insect.top }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      backdropComponent={renderBackdrop}
      enableOverDrag={false}
      onDismiss={handleSheetDismiss}>
      <BottomSheetScrollView style={(styles.bottomSheetContent, { paddingBottom: insect.bottom })}>
        <View style={[styles.bottomSheetHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleDismissModal} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>
              {t('venues.categories')}
            </Text>
          </View>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={[styles.selectAllText, { color: colors.accent }]}>
              {localSelectedCategories.length === categoriesLength
                ? t('venues.deselectAll')
                : t('venues.selectAll')}
            </Text>
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView
          style={(styles.categoriesList, { paddingBottom: insect.bottom })}
          contentContainerStyle={styles.categoriesListContent}
          showsVerticalScrollIndicator={false}>
          {isCategoriesLoading || !categories || !Array.isArray(categories)
            ? Array(8)
                .fill(0)
                .map((_, index) => (
                  <View
                    key={index}
                    style={[styles.categoryItem, { backgroundColor: colors.background }]}>
                    <View style={[styles.skeletonItem, { backgroundColor: colors.accent }]} />
                  </View>
                ))
            : filteredCategories.map((category: Category) => (
                <Pressable
                  key={category.id}
                  style={[styles.categoryItem, { backgroundColor: colors.background }]}
                  onPress={() => handleToggleCategory(category.name)}>
                  <View style={styles.categoryInfoContainer}>
                    <Icon
                      name="category"
                      size={20}
                      color={colors.textSecondary}
                      style={styles.categoryIcon}
                    />
                    <Text
                      style={[styles.categoryText, { color: colors.textPrimary }]}
                      numberOfLines={1}>
                      {category.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: colors.border,
                        backgroundColor: localSelectedCategories.includes(category.name)
                          ? colors.accent
                          : 'transparent',
                      },
                      localSelectedCategories.includes(category.name) && styles.checkboxSelected,
                    ]}>
                    {localSelectedCategories.includes(category.name) && (
                      <Icon name="check" size={16} color="#fff" />
                    )}
                  </View>
                </Pressable>
              ))}
        </BottomSheetScrollView>

        <View
          style={[
            styles.bottomSheetFooter,
            {
              borderTopColor: colors.border,
              marginBottom: insect.bottom + 80,
            },
          ]}>
          <TouchableOpacity onPress={() => setLocalSelectedCategories([])}>
            <Text style={[styles.resetText, { color: colors.accent }]}>{t('venues.resetAll')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.accent }]}
            onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>{t('venues.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 16,
    marginVertical: 12,
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
  categoriesList: {
    flex: 1,
  },
  categoriesListContent: {
    paddingBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  categoryInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderWidth: 0,
  },
  bottomSheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skeletonItem: {
    height: 44,
    borderRadius: 8,
    opacity: 0.3,
  },
});
