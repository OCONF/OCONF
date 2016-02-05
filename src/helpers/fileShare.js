import $ from 'jquery';
import { Skynet } from '../index';

export function fileTransfer (state, transferId, peerId, transferInfo, error) {
  let displayName = Skynet.getPeerInfo(peerId).userData;
  let transferStatus = $('#' + peerId + '_' + transferId)[0];

  switch (state) {
    case Skynet.DATA_TRANSFER_STATE.UPLOAD_REQUEST:
      let result = confirm('Incoming transfer request!\n\nFile: ' + transferInfo.name +
        '\n\nAccept?');
      Skynet.acceptDataTransfer(peerId, transferId, result);
      break;
    case Skynet.DATA_TRANSFER_STATE.UPLOAD_STARTED:
      addMessage('You\'ve sent a file: ' + transferInfo.name);
      break;
    case Skynet.DATA_TRANSFER_STATE.DOWNLOAD_STARTED:
      addFile(transferId, peerId, displayName, transferInfo, false);
      break;
    case Skynet.DATA_TRANSFER_STATE.UPLOADING:
      if (transferStatus) {
        transferStatus.innerHTML = (transferInfo.percentage);
        transferStatus.innerHTML += '%';
      } else {
        addFile(transferId, peerId, displayName, transferInfo, true);
      }
      break;
    case Skynet.DATA_TRANSFER_STATE.DOWNLOADING:
      transferStatus.innerHTML = (transferInfo.percentage);
      transferStatus.innerHTML += '%';
      break;
    case Skynet.DATA_TRANSFER_STATE.DOWNLOAD_COMPLETED:
      transferStatus.innerHTML = 'Completed';
      transferStatus = $('#' + transferId)[0];
      transferStatus.href = URL.createObjectURL(transferInfo.data);
      transferStatus.style.display = 'block';
      break;
    case Skynet.DATA_TRANSFER_STATE.UPLOAD_COMPLETED:
      transferStatus.innerHTML = 'Completed';
      break;
    case Skynet.DATA_TRANSFER_STATE.REJECTED:
      alert(displayName + ' has rejected your request.\n\nFile: ' + transferInfo.name +
        '\n\nSize: ' + transferInfo.size);
      break;
    case Skynet.DATA_TRANSFER_STATE.ERROR:
      addMessage(transferId + ' failed. Reason: \n' +
        error.message);
      transferStatus.innerHTML = 'Failed';
      break;
    case Skynet.DATA_TRANSFER_STATE.CANCEL:
      addMessage(transferId + ' canceled. Reason: \n' +
        error.message);
      transferStatus.innerHTML = 'Canceled';
    }
}


function addMessage(message, className) {
  var infobox = $('#infobox'),
  div = document.createElement('div');
  div.className = className;
  div.innerHTML = message;
  $('#infobox').append(div);
}

function addFile(transferId, peerId, displayName, transferInfo, isUpload) {
  var transfers = $('#transfers'),
  item = document.createElement('tr');
  item.innerHTML = '<td>' + ((isUpload) ? '&#8657;' : '&#8659;') + '</td>' +
    '<td>' + displayName + '</td><td>' + transferInfo.name +
    '</td><td><span id="' + peerId + '_' + transferId + '"></span>' +
    ((!isUpload) ? '<a id="' + transferId + '" href="#" download="' +
      transferInfo.name + '" style="display:none">Download</a>' : '') + '</td>';
  transfers.append(item);
}