import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from './useAuth';
import { usePets } from './usePets';
import { dobuCamApi } from '../api/dobuCam';
import { accountKey } from '../services/queries';

export function useCameras(initialPetId = '') {
  const client = useQueryClient();
  const { user } = useAuth();
  const pets = usePets();
  const [selected, setSelected] = useState(initialPetId);
  const petId = pets.data?.find((pet) => pet.id === selected)?.id || pets.data?.[0]?.id;
  const cameras = useQuery({ queryKey: [...accountKey(user), 'cameras', petId], queryFn: () => dobuCamApi.listarPorPet(petId), enabled: Boolean(user && petId), retry: false });
  const criar = useMutation({ mutationFn: (nome) => {
    if (!petId || !pets.data?.some((pet) => pet.id === petId)) throw new Error('Selecione um animal disponível.');
    if (!nome.trim()) throw new Error('Informe o nome da câmera.');
    return dobuCamApi.criar({ localizacao: nome.trim(), statusCamera: 'ATIVA', dataUltimaMovimentacao: new Date().toISOString(), petId });
  }, retry: false, onSuccess: () => client.invalidateQueries({ queryKey: [...accountKey(user), 'cameras'] }) });
  return { pets, cameras, petId, setSelected, criar };
}
