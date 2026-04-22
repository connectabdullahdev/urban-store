/**
 * CheckoutScreen - shipping details + order summary
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

import CustomInput from '@components/CustomInput';
import CustomButton from '@components/CustomButton';
import {useTheme} from '@theme/ThemeContext';
import {spacing, typography, radius} from '@theme/theme';
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from '@redux/slices/cartSlice';
import {selectUser} from '@redux/slices/authSlice';
import {saveOrder} from '@services/userService';

const SHIPPING = 5.0;
const TAX_RATE = 0.05;

const CheckoutScreen = ({navigation}) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const user = useSelector(selectUser);

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING + tax;

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Name required';
    if (!phone.trim()) e.phone = 'Phone required';
    else if (!/^\+?[\d\s-]{10,}$/.test(phone)) e.phone = 'Invalid phone';
    if (!address.trim()) e.address = 'Address required';
    if (!city.trim()) e.city = 'City required';
    if (!postal.trim()) e.postal = 'Postal code required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const order = {
        items: items.map(i => ({
          id: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
        shipping: {fullName, phone, address, city, postal},
        paymentMethod,
        subtotal,
        shippingFee: SHIPPING,
        tax,
        total,
        status: 'pending',
      };
      if (user?.uid) {
        await saveOrder(user.uid, order);
      }
      dispatch(clearCart());

      Alert.alert(
        '🎉 Order placed!',
        `Your order total $${total.toFixed(2)} has been confirmed.`,
        [
          {
            text: 'Back to Home',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{name: 'MainTabs'}],
              }),
          },
        ],
      );
    } catch (err) {
      Alert.alert('Error', 'Could not place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, {backgroundColor: theme.colors.surface}]}
          hitSlop={8}>
          <Icon name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Checkout
        </Text>
        <View style={{width: 40}} />
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{padding: spacing.xl, paddingBottom: 140}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Shipping */}
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Shipping details
          </Text>
          <CustomInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
            autoCapitalize="words"
            icon="person-outline"
            error={errors.fullName}
          />
          <CustomInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+92 300 1234567"
            keyboardType="phone-pad"
            icon="call-outline"
            error={errors.phone}
          />
          <CustomInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="House, Street, Area"
            icon="home-outline"
            multiline
            autoCapitalize="sentences"
            error={errors.address}
          />
          <View style={{flexDirection: 'row', gap: spacing.md}}>
            <View style={{flex: 1}}>
              <CustomInput
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="Karachi"
                autoCapitalize="words"
                error={errors.city}
              />
            </View>
            <View style={{flex: 1}}>
              <CustomInput
                label="Postal Code"
                value={postal}
                onChangeText={setPostal}
                placeholder="75500"
                keyboardType="number-pad"
                error={errors.postal}
              />
            </View>
          </View>

          {/* Payment */}
          <Text
            style={[
              styles.sectionTitle,
              {color: theme.colors.text, marginTop: spacing.lg},
            ]}>
            Payment method
          </Text>

          <PaymentOption
            label="Cash on Delivery"
            icon="cash-outline"
            selected={paymentMethod === 'cod'}
            onPress={() => setPaymentMethod('cod')}
            theme={theme}
          />
          <PaymentOption
            label="Credit / Debit Card"
            icon="card-outline"
            selected={paymentMethod === 'card'}
            onPress={() => setPaymentMethod('card')}
            theme={theme}
          />

          {/* Summary */}
          <View
            style={[
              styles.summary,
              {backgroundColor: theme.colors.card},
            ]}>
            <Text
              style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Order summary
            </Text>
            <SummaryRow
              label={`Items (${items.length})`}
              value={`$${subtotal.toFixed(2)}`}
              theme={theme}
            />
            <SummaryRow
              label="Shipping"
              value={`$${SHIPPING.toFixed(2)}`}
              theme={theme}
            />
            <SummaryRow
              label="Tax"
              value={`$${tax.toFixed(2)}`}
              theme={theme}
            />
            <View
              style={[
                styles.divider,
                {backgroundColor: theme.colors.border},
              ]}
            />
            <View style={styles.totalRow}>
              <Text
                style={[styles.totalLabel, {color: theme.colors.text}]}>
                Total
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  {color: theme.colors.primary},
                ]}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.colors.card,
              borderTopColor: theme.colors.border,
            },
          ]}>
          <CustomButton
            title={`Place Order · $${total.toFixed(2)}`}
            onPress={handlePlaceOrder}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const PaymentOption = ({label, icon, selected, onPress, theme}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.paymentRow,
      {
        backgroundColor: theme.colors.card,
        borderColor: selected ? theme.colors.primary : theme.colors.border,
      },
    ]}>
    <Icon
      name={icon}
      size={22}
      color={selected ? theme.colors.primary : theme.colors.text}
    />
    <Text
      style={[
        styles.paymentLabel,
        {color: theme.colors.text},
      ]}>
      {label}
    </Text>
    <View
      style={[
        styles.radio,
        {
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      {selected && (
        <View
          style={[styles.radioDot, {backgroundColor: theme.colors.primary}]}
        />
      )}
    </View>
  </Pressable>
);

const SummaryRow = ({label, value, theme}) => (
  <View style={styles.summaryRow}>
    <Text style={{color: theme.colors.textSecondary}}>{label}</Text>
    <Text style={{color: theme.colors.text, fontWeight: '600'}}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {flex: 1},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {...typography.h3},
  sectionTitle: {...typography.h4, marginBottom: spacing.md},
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  paymentLabel: {flex: 1, marginLeft: spacing.md, fontWeight: '600'},
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {width: 10, height: 10, borderRadius: 5},
  summary: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  divider: {height: 1, marginVertical: spacing.sm},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {...typography.h4},
  totalValue: {...typography.h3, fontWeight: '900'},
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
  },
});

export default CheckoutScreen;
