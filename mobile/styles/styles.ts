import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  verticallySpaced: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.borderLight,
    color: colors.textMuted,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  avatar: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    maxWidth: '100%',
    marginBottom: spacing.lg,
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: colors.divider,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
  },
});
