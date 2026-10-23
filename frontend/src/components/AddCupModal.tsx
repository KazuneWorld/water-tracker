'use client';

import { useState } from 'react';
import { CreateCupInput, Cup } from '@/types/cup';
import { createCup } from '@/lib/api';

interface AddCupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newCup: Cup) => void;
}

export function AddCupModal({ isOpen, onClose, onSuccess }: AddCupModalProps) {
    const [name, setName] = useState('');
    const [capacityMl, setCapacityMl] = useState<number>(200);
    const [type, setType] = useState<'cup' | 'bottle'>('cup');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const resetForm = () => {
        setName('');
        setCapacityMl(200);
        setType('cup');
        setErrorMessage(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        const trimmedName = name.trim();
        if (!trimmedName) {
            setErrorMessage('容器の名前を入力してください。');
            return;
        }
        if (trimmedName.length > 50) {
            setErrorMessage('容器の名前は50文字以内で入力してください。');
            return;
        }
        if (!Number.isInteger(capacityMl) || capacityMl < 1 || capacityMl > 5000) {
            setErrorMessage('容量は1〜5000mlの整数で入力してください。');
            return;
        }

        setSubmitting(true);
        const inputData: CreateCupInput = {
            name: trimmedName,
            capacity_ml: capacityMl,
            type,
            color: 'blue', // カラーは一旦固定値
        };

        try {
            const newCup = await createCup(inputData);
            onSuccess(newCup);
            handleClose();
        } catch {
            setErrorMessage('容器の登録に失敗しました。もう一度お試しください。');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div onClick={handleClose} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl max-w-md w-full p-6 relative">
                <h2 className="text-xl font-bold text-slate-800 mb-4">新しい容器を追加</h2>

                {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 容器名 */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            容器の名前
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={50}
                            placeholder="例: よく使うマグカップ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 容量 */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            容量 (ml)
                        </label>
                        <input
                            type="number"
                            required
                            min={1}
                            max={5000}
                            step={1}
                            value={capacityMl}
                            onChange={(e) => setCapacityMl(Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 容器タイプ選択 */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            タイプ
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* コップボタン */}
                            <button
                                type="button"
                                onClick={() => setType('cup')}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${type === 'cup'
                                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <span className="text-xs">コップ (ワンタップ)</span>
                            </button>

                            {/* 水筒ボタン */}
                            <button
                                type="button"
                                onClick={() => setType('bottle')}
                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${type === 'bottle'
                                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <span className="text-xs">水筒 (1日1回)</span>
                            </button>
                        </div>
                    </div>

                    {/* ボタンエリア */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 cursor-pointer hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {submitting ? '追加中...' : '追加する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}