+-----------------------------------------------------------------------------+
| �^�C�g�� | Escape Codec Library                                             |
|�o�[�W����| Ver.041208                                                       |
|�t�@�C����| ecl.js, TransEscape.html                                         |
| �`    �� | HTML4.01 + JavaScript1.3                                         |
| ����� | ��L�̌`�����T�|�[�g����u���E�U                                 |
| ����m�F | InternetExplorer6.0, MozillaFirefox1.0, Netscape7.1, Opera7.53   |
|�\�t�g���| �t���[�\�t�g                                                     |
|�]�ڂ̉�| ��                                                               |
| �� �� �� | �k���R���A�[�J�C�u�X�E�f�W�^�����쎺                             |
| �t �q �k | http://nurucom-archives.hp.infoseek.co.jp/digital/               |
+-----------------------------------------------------------------------------+

[����]
�E����������ׂẴR���s���[�^�œǂ߂�悤�Ȍ`���ɕϊ�������A
�@�ϊ����ꂽ���̂����̕�����Ƀf�R�[�h���邱�Ƃ��ł���֐��̃��C�u�����ł��B

�E�r���g�C���֐��� escape() , unescape() �Ƃ͈قȂ�A�ǂ̎�ނ̃u���E�U�ł�
�@�����ϊ����ʂ������܂��B

�EJIS�R�[�h�ϊ��e�[�u���𓋍ڂ��Ă���̂ŁA�]��JavaScript�ł͎�����
�@����ł������AShift_JIS�R�[�h��EUC-JP�R�[�h�Ȃǂ̕����R�[�h�Ƃ��Ă�
�@�G���R�[�h�E�f�R�[�h���\�ƂȂ��Ă��܂��B
�@�Ȃ��A���̕ϊ��e�[�u���́A���ڊ����͋L�q�����AUnicode �ԍ������k�����f�[�^
�@��ASCII�R�[�h�̕����݂̂ŋL�q���Ă��邽�߁A�C�ӂ̕����R�[�h�Ŏg�p�\�ł��B

�E����m�F�p�̓��̓t�H�[�� TransEscape.html ��t�����Ă���̂ŁA
�@�����Ɏg�p���邱�Ƃ��ł��܂��B


[�֐��̐���]
��EscapeSJIS(string)
�@string ��Shift_JIS�R�[�h�̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B
�@�����[�h�̊G�����̈�̕������������Ƃ��ł��܂��B

��UnescapeSJIS(escapedString)
�@Shift_JIS�R�[�h�̃^�C�v�� escape �G���R�[�h���ꂽ escapedString ��
�@���̕�����Ƀf�R�[�h�����l��Ԃ��܂��B

��EscapeEUCJP(string)
�@string ��EUC-JP�R�[�h�̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B

��UnescapeEUCJP(escapedString)
�@EUC-JP�R�[�h�̃^�C�v�� escape �G���R�[�h���ꂽ escapedString ��
�@���̕�����Ƀf�R�[�h�����l��Ԃ��܂��B

��EscapeJIS7(string)
�@string ��JIS�R�[�h�̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B
�@���p�J�^�J�i���g�p�\�ŁA7�r�b�g�ŃG���R�[�h����܂��B

��UnescapeJIS7(escapedString)
�@JIS�R�[�h�̃^�C�v�� escape �G���R�[�h���ꂽ escapedString ��
�@���̕�����Ƀf�R�[�h�����l��Ԃ��܂��B
�@7�r�b�g�ŃG���R�[�h���ꂽ���p�J�^�J�i���f�R�[�h���邱�Ƃ��ł��܂��B

��EscapeJIS8(string)
�@string ��JIS�R�[�h�̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B
�@���p�J�^�J�i�́A8�r�b�g�ŃG���R�[�h����܂��B

��UnescapeJIS8(escapedString)
�@JIS�R�[�h�̃^�C�v�� escape �G���R�[�h���ꂽ escapedString ��
�@���̕�����Ƀf�R�[�h�����l��Ԃ��܂��B
�@8�r�b�g�ŃG���R�[�h���ꂽ���p�J�^�J�i���f�R�[�h���邱�Ƃ��ł��܂��B

��EscapeUnicode(string)
�@string �� Unicode �̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B
�@IE4.0�ȏ�� escape() �ƌ݊���������܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��UnescapeUnicode(escapedString)
�@Unicode �̃^�C�v�� escape �G���R�[�h���ꂽ escapedString ��
�@���̕�����Ƀf�R�[�h�����l��Ԃ��܂��B
�@IE4.0�ȏ�� unescape() �ƌ݊���������܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��EscapeUTF7(string)
�@string �� UTF-7�R�[�h�̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��UnescapeUTF7(escapedString)
�@UTF-7�R�[�h�� escapedString �����̕�����Ƀf�R�[�h�����l��Ԃ��܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��EscapeUTF8(string)
�@string �� UTF-8�R�[�h�̃^�C�v�� escape �G���R�[�h�����l��Ԃ��܂��B
�@IE5.5 �ȏ�Ŏ�������Ă��� encodeURI() �������� encodeURIComponent() �Ƃ́A
�@�G���R�[�h���镶���͈̔͂��قȂ邽�߁A����̒l�͓����܂��񂪁A
�@������IE5.5 �ȏ�Ŏ�������� decodeURI() , decodeURIComponent()
�@�Ŗ��Ȃ��f�R�[�h���邱�Ƃ��ł��܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��UnescapeUTF8(escapedString)
�@UTF-8�R�[�h�̃^�C�v�� escape �G���R�[�h���ꂽ escapedString ��
�@���̕�����Ƀf�R�[�h�����l��Ԃ��܂��B
�@IE5.5 �ȏ�Ŏ�������Ă��� decodeURI() , decodeURIComponent()
�@�ƌ݊���������܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B
�@���r���g�C���֐��� decodeURI() ���������Ƀf�R�[�h���܂��iIE6.0�Ŋm�F�j

��EscapeUTF16LE(string)
�@string �� UTF-16LE�i���g���G���f�B�A���j�R�[�h�̃^�C�v��
�@escape �G���R�[�h�����l��Ԃ��܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��UnescapeUTF16LE(escapedString)
�@UTF-16LE�i���g���G���f�B�A���j�R�[�h�̃^�C�v�� escape �G���R�[�h���ꂽ
�@escapedString �����̕�����Ƀf�R�[�h�����l��Ԃ��܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B

��GetEscapeCodeType(escapedString)
�@escape �G���R�[�h���ꂽ escapedString ����͂��A
�@�ǂ̃R�[�h�̃^�C�v���𔻒肵�܂��B
�@�����p�J�^�J�i�݂̂���Ȃ镶������G���R�[�h�������̂�A
�@�@�ꕔ���𔲂��o�������́A��ꂽ���̂Ȃǂ́A
�@�@���m�ɔ���ł��Ȃ��ꍇ������܂��B
�@��UTF-7�͔��肳��܂���B
�@���R�[�h�̃^�C�v�� ASCII �̏ꍇ�A"EUCJP" �Ɣ��肳��܂��B
�@�����C�u��������؂����ĒP�̂Ŏg�p���邱�Ƃ��\�ł��B
�@���ȉ��̂悤�ɂ��邱�ƂŁA�������ʋ@�\�t�� Unescape �֐����������܂��B
    UnescapeAutoDetect=function(str){
        return window["Unescape"+GetEscapeCodeType(str)](str)
    };

��JCT11280 �yString Object�z
�@JIS�K�i�iJIS X 0208-1997�j�Ɏ�荞�܂�Ă��镶���ɉ����āA
�@Windows�Ŏg�p�ł��遛�t�������₉���[�h�̊G�����̈�̕���
�@�iShift_JIS ����� Unicode �n�̃R�[�h�Ŏg�p�\�j
�@�Ȃǂ�������11280�����i����`�̈���܂ށj���AJIS�R�[�h���ő������Ă��܂��B
�@����𐶐�����֐��́A11280��������Unicode �ԍ����������k���āA
�@ASCII�R�[�h�̕����݂̂��g���ĕ����������f�[�^�ƃf�R�[�h�v���O��������Ȃ�A
�@�t�@�C���ǂݍ��ݎ��Ɏ��s����āA���̕����𐶐�����悤�ɂȂ��Ă��܂��B
�@���̎d�g�݂ɂ��A11280�������L�q����̂ɕK�v�ȃo�C�g���̔����߂��ɂ܂�
�@�T�C�Y���k������A�����Ċ����������ڋL�q����Ă��Ȃ��̂ŁA
�@�C�ӂ̕����R�[�h�Ŏg�p���邱�Ƃ��\�ƂȂ�܂��B
�@�܂��A</ �Ƃ������u���E�U�����������邨����̂��镶������܂܂�Ă��Ȃ��̂ŁA
�@����HTML�t�@�C���ɂ��̐����֐����L�q���邱�Ƃ��\�ł��B
�@EscapeSJIS() , UnescapeSJIS() �Ŏg�p���Ă��܂��B

��JCT8836 �yString Object�z
�@��L�� JCT11280 �̐擪����8836�����܂ł��������Ă��܂��B
�@EscapeEUCJP() , UnescapeEUCJP() , EscapeJIS7() , UnescapeJIS7() , 
�@EscapeJIS8() , UnescapeJIS8() �Ŏg�p���Ă��܂��B


[����]
�EShift_JIS�AEUC-JP�AJIS�R�[�h�ł́AJIS�R�[�h�ϊ��e�[�u���ɖ�������
�iJIS X 0212-1990 �̕⏕�����Ȃǁj�́u�E�v�ƂȂ�܂��̂Œ��ӂ��Ă��������B

�E���݂̃o�[�W�����ł́ANetscape 4.x �ł̓���͕ۏႵ�Ă��܂���B

�EEscape Codec Library ����� TransEscape ���g�����Ƃɂ����
�@�s���v�����������Ƃ��Ă��A�����ł͈�ؐӔC�͕����܂���B


[�X�V����]
Ver.041208  JCT11280 �����֐��̍����k����
            GetEscapeCodeType() ��UTF-7�͔��肵�Ȃ��悤�ɂ���
            ���̑��A�R�[�h�̌�����

Ver.041122  EscapeUTF7() , UnescapeUTF7() , EscapeUTF16LE() ,
            UnescapeUTF16LE() �����炽�ɒǉ����A
            �����̃R�[�h������ł���悤�� GetEscapeCodeType() ������

Ver.041121  UnescapeSJIS() , UnescapeEUCJP() , UnescapeJIS7() ,
            UnescapeJIS8() , UnescapeUTF8() �� escapedString ��
            �s���ȕ���������ꍇ�A���̕����̓f�R�[�h���Ȃ��悤�ɂ���

Ver.041120  EscapeSJIS() , UnescapeSJIS() �́AJIS X 0208 �͈̔͂�
            �����镶���������ۂɐ�����s����C��
            JIS�R�[�h�ϊ��e�[�u���̕�������11280�����ɑ���

Ver.041118  Netscape 4.x �̃T�|�[�g���I��
            EscapeJIS7() , EscapeJIS8() �̍�����
            GetEscapeCodeType() �̔���̐��x���エ��э�����
            ���̑��A�R�[�h�̌�����

Ver.041104  GetEscapeCodeType() �̃p�����[�^���C��
            ���̑��A�R�[�h�̌�����

Ver.041101  �����R�[�h�^�C�v�̔���֐� GetEscapeCodeType() �����C�u�����ɒǉ�
            ���̑��A�R�[�h�̌�����

Ver.041028  UnescapeJIS7() , UnescapeJIS8() ��
            �G�X�P�[�v�V�[�P���X�̎���͈͂��L����
            ���̑��A�R�[�h�S�̂̌�����

Ver.041021  Netscape 4.x �ł� UnescapeUnicode() �̕s������S�C��

Ver.041014  UnescapeUnicode() �̖߂�l��length ���ُ킾�����̂��C��
            �iNetscape 4.x �ł́Alength �ُ͈�Ȃ܂܂ł��j

Ver.041007  Netscape 4.78 �ɑΉ�����

Ver.040927  ���J�J�n

