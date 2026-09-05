'use client';

import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

type Member = {
  id: string;
  name: string;
  email: string;
};

type BoardMember = {
  id: string;
  user: Member;
};

type BoardMembersResponse = {
  data: BoardMember[];
};

type BoardMembersProps = {
  boardId: string;
};

const BoardMembers = ({ boardId }: BoardMembersProps) => {
  const [members, setMembers] = useState<BoardMember[]>([]);

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [removingId, setRemovingId] = useState('');

  const [error, setError] = useState('');

  const fetchMembers = useCallback(async () => {
    try {
      const response = await api.get<BoardMembersResponse>(
        `/boards/members/${boardId}`,
      );

      setMembers(response.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch members',
      );
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      await api.post(`/boards/add-member/${boardId}`, {
        email,
      });

      setEmail('');

      await fetchMembers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${memberEmail}?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setRemovingId(memberEmail);

    try {
      await api.delete(`/boards/remove-member/${boardId}`, {
        email: memberEmail,
      });

      await fetchMembers();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to remove member',
      );
    } finally {
      setRemovingId('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Board Members</h2>

        <p className="mt-1 text-sm text-gray-500">
          Add or remove members from this board.
        </p>
      </div>

      <form onSubmit={handleAddMember} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
          placeholder="Member email"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add Member'}
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-500">No members yet.</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <p className="font-medium">{member.user.name}</p>

                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMember(member.user.email)}
                disabled={removingId === member.user.email}
                className="rounded border px-3 py-2 text-sm text-red-500 disabled:opacity-50"
              >
                {removingId === member.user.email ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardMembers;
