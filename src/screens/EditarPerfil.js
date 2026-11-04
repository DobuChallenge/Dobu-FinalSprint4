import { useEditarPerfil } from '../hooks/useEditarPerfil';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import Button from '../components/Button';
import Card from '../components/Card';
import PhotoPicker from '../components/PhotoPicker';
import Screen from '../components/Screen';
import TextInput from '../components/TextInput';
import { usuariosApi } from '../api/usuarios';
import { useAuth, useUpdateCurrentUser } from '../hooks/useAuth';
import { useProfileExtras } from '../hooks/useProfileExtras';
import { removeProfileExtras, saveProfileExtras } from '../storage/profileExtrasStorage';
import { cores } from '../styles/tema';
import { ui } from '../styles/ui';

export default function EditarPerfil({ navigation }) {
  const { user, draft, error, salvando, excluindo, setField, salvar, confirmarExclusao } = useEditarPerfil(navigation);
;
